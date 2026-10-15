"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Wallet,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserRowMenuProps {
  userId: string;
  email: string | null;
  displayName: string;
  verified: boolean;
}

export function UserRowMenu({ userId, email, displayName, verified }: UserRowMenuProps) {
  const router = useRouter();
  const [markedVerified, setMarkedVerified] = useState(verified);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [pending, setPending] = useState(false);

  const expectedConfirmation = email?.trim() || userId;
  const canDelete = confirmValue.trim().toLowerCase() === expectedConfirmation.toLowerCase();

  async function markVerified() {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not verify this user");
      }
      setMarkedVerified(true);
      setVerifyOpen(false);
      toast.success("Account verified. They can sign in.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify this user");
    } finally {
      setPending(false);
    }
  }

  async function deleteUser() {
    if (!canDelete) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: confirmValue.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not delete this user");
      }
      setDeleteOpen(false);
      setConfirmValue("");
      toast.success("User and their data were deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete this user");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`size-8 border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white ${adminGlass.field}`}
            aria-label={`Actions for ${displayName}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={adminGlass.menu}>
          <DropdownMenuLabel className={adminGlass.menuLabel}>Account</DropdownMenuLabel>
          <p className="px-2 pb-2 text-xs text-zinc-500 truncate max-w-[12rem]">
            {email || userId}
          </p>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild>
            <Link href={`/admin/balances?user=${userId}`} className="cursor-pointer">
              <Wallet className="size-4" />
              Manage balance
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/account-controls?user=${userId}`} className="cursor-pointer">
              <ShieldAlert className="size-4" />
              Freeze & banking
            </Link>
          </DropdownMenuItem>
          {!markedVerified && (
            <>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setVerifyOpen(true);
                }}
              >
                <ShieldCheck className="size-4 text-emerald-400" />
                Mark verified
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={verifyOpen} onOpenChange={(open) => !pending && setVerifyOpen(open)}>
        <AlertDialogContent className={adminGlass.dialog}>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark account verified</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Confirms {email || "this account"} without the email link. They can sign in with the
              password they chose at signup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending} className={adminGlass.field}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                markVerified();
              }}
              className="bg-emerald-500 text-white hover:bg-emerald-400"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Mark verified
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (pending) return;
          setDeleteOpen(open);
          if (!open) setConfirmValue("");
        }}
      >
        <DialogContent className={`sm:max-w-md ${adminGlass.dialog}`} showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Removes the login, wallets, balances, transactions, loans, bank accounts, recovery
              requests, support tickets, and uploaded files. This cannot be undone. Encrypted wallet
              backups already emailed stay in that inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500" htmlFor={`confirm-delete-${userId}`}>
              {email ? `Type ${email} to confirm` : "Type the user ID to confirm"}
            </label>
            <Input
              id={`confirm-delete-${userId}`}
              value={confirmValue}
              onChange={(event) => setConfirmValue(event.target.value)}
              autoComplete="off"
              className={adminGlass.field}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              className={adminGlass.field}
              onClick={() => {
                setDeleteOpen(false);
                setConfirmValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending || !canDelete}
              onClick={deleteUser}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
