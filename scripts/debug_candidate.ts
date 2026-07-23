import { createAdminClient } from "../src/lib/supabase/admin";
import { getAdminCandidateDetailAction } from "../src/actions/admin/users";

async function test() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("users").select("id").eq("role", "candidate").limit(1).single();
  
  if (data) {
    const result = await getAdminCandidateDetailAction(data.id);
    console.log(result);
  } else {
    console.log("No candidate found");
  }
}
test();
