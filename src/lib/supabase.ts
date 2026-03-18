import { createClient, SupabaseClient } from '@supabase/supabase-js'

function getUrl() { return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co' }
function getAnonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key' }
function getServiceKey() { return process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key' }

export function getSupabase() { return createClient(getUrl(), getAnonKey()) }
export function createServiceClient() { return createClient(getUrl(), getServiceKey()) }

let _supabase: SupabaseClient | null = null
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target: SupabaseClient, prop: string | symbol) {
    if (!_supabase) _supabase = createClient(getUrl(), getAnonKey())
    return (_supabase as any)[prop]
  }
})

/*
-- Supabase SQL Schema for HireProof
-- Run this in the Supabase SQL editor to set up your database

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  start_date DATE NOT NULL,
  work_state CHAR(2) NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'blocked', 'cleared')),
  compliance_score INTEGER DEFAULT 0,
  total_requirements INTEGER DEFAULT 0,
  completed_requirements INTEGER DEFAULT 0,
  risk_exposure_dollars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hire_id UUID REFERENCES hires(id) ON DELETE CASCADE,
  requirement_id TEXT NOT NULL,
  requirement_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('federal', 'state', 'company')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'waived')),
  completion_type TEXT NOT NULL,
  gate_order INTEGER NOT NULL,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  penalty_amount TEXT,
  penalty_citation TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE onboarding_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hire_id UUID REFERENCES hires(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  current_step INTEGER DEFAULT 1,
  max_step INTEGER DEFAULT 6,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  completed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hire_id UUID REFERENCES hires(id) ON DELETE CASCADE,
  token_id UUID REFERENCES onboarding_tokens(id) ON DELETE CASCADE,
  signature_type TEXT NOT NULL CHECK (signature_type IN ('canvas', 'typed', 'acknowledgment')),
  signature_data TEXT,
  typed_name TEXT,
  document_name TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mcp_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hires_user_id ON hires(user_id);
CREATE INDEX idx_hires_status ON hires(status);
CREATE INDEX idx_compliance_items_hire_id ON compliance_items(hire_id);
CREATE INDEX idx_onboarding_tokens_token ON onboarding_tokens(token);
CREATE INDEX idx_onboarding_tokens_hire_id ON onboarding_tokens(hire_id);
CREATE INDEX idx_signatures_hire_id ON signatures(hire_id);
CREATE INDEX idx_mcp_usage_user_id ON mcp_usage(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hires ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies (simplified for demo)
CREATE POLICY "Users can manage their own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own hires" ON hires FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage compliance items for their hires" ON compliance_items FOR ALL
  USING (hire_id IN (SELECT id FROM hires WHERE user_id = auth.uid()));
*/
