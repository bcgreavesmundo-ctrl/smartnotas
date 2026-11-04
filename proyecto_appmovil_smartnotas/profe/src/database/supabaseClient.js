import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Reemplaza estas credenciales por las de tu proyecto en Supabase (Settings -> API)
const SUPABASE_URL = 'https://oaiaxxawismcwaheetqi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dmuVGA4NoVhX5KoyqrsK3A_dH5VT0Wr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);