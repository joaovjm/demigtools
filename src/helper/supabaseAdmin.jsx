import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://khsapythnppdplqnlmkj.supabase.co";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2FweXRobnBwZHBscW5sbWtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDA3NjI5NywiZXhwIjoyMDU1NjUyMjk3fQ.1o-Hq4rIo99uMNoJO7UiT4Sdp3vKGiXul3Wba4Odnds";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabaseAdmin;
