import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Checking loan_types...");
    const { data, error } = await supabase.from("loan_types").select("*");

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Loan Types found:", data?.length);
        console.dir(data, { depth: null });
    }
}

main();
