import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials not configured.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('views')
        .eq('id', 1)
        .single();

      if (error) throw error;
      return res.status(200).json({ views: data?.views || 0 });
    } catch (err) {
      console.error('Error fetching views:', err);
      return res.status(500).json({ error: 'Failed to fetch views' });
    }
  } 
  
  if (req.method === 'POST') {
    try {
      // Assuming row with id=1 exists for global views
      const { data: currentData, error: fetchError } = await supabase
        .from('analytics')
        .select('views')
        .eq('id', 1)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // PGRST116 is not found

      const currentViews = currentData ? currentData.views : 0;
      
      const { data, error } = await supabase
        .from('analytics')
        .upsert({ id: 1, views: currentViews + 1 })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ views: data.views });
    } catch (err) {
      console.error('Error incrementing views:', err);
      return res.status(500).json({ error: 'Failed to increment views' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
