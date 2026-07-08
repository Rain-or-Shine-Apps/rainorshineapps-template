import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Deleting a Supabase auth user requires the service_role key, which must never reach the
// client app — this function resolves the caller's identity from their own JWT first, then
// uses the admin client only to delete that exact verified user.
//
// If your app has tables that DON'T cascade-delete on auth.users(id) (check your
// `references auth.users(id) on delete cascade` foreign keys), delete those rows here
// with the adminClient before deleting the user, the same way you would client-side —
// e.g. `await adminClient.from('your_table').delete().eq('user_id', user.id);`
Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ADD ANY NON-CASCADING TABLE DELETION LOGIC HERE, using adminClient and user.id.

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
