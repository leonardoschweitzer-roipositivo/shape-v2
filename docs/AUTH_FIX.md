# ✅ Correção da Autenticação - VITRU IA

**Data:** 10/02/2026  
**Status:** ✅ RESOLVIDO

---

## 🐛 Problema Original

A autenticação com Supabase não estava funcionando. Ao tentar fazer login ou cadastro, a aplicação retornava erros:
- **Cadastro:** Erro 500 - "Database error saving new user"
- **Login:** Erro 400 - "Bad Request" no endpoint `/auth/v1/token`

---

## 🔍 Diagnóstico

### 1. Chave Supabase Incompleta
- **Arquivo:** `.env`
- **Problema:** A `VITE_SUPABASE_ANON_KEY` estava truncada
- **Valor Incorreto:** `sb_publishable_WuJ7ph2dhHKcnkJIq276OQ_jEiG_bho`
- **Valor Correto:** JWT completo com 200+ caracteres

### 2. Trigger do Banco de Dados com Erro
- **Problema:** A função `handle_new_user()` falhava ao criar perfis
- **Causa:** Falta de tratamento de erros e permissões incorretas
- **Resultado:** Usuários eram criados no `auth.users` mas falhavam ao criar o perfil em `profiles`

---

## 🔧 Soluções Aplicadas

### **Fix 1: Atualização da Chave ANON_KEY**

**Arquivo modificado:** `.env`

```bash
# Antes (incorreto):
VITE_SUPABASE_ANON_KEY=sb_publishable_WuJ7ph2dhHKcnkJIq276OQ_jEiG_bho

# Depois (correto):
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cXdoZWJ4YmVueGJ3YWJpemh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzk2OTEsImV4cCI6MjA4NjMxNTY5MX0.Kqq2nnvpq36VnMZTArccgCKlvQh5aMKxdGZRpscxtUk
```

**Como obter a chave correta:**
1. Acesse: https://app.supabase.com/project/jvqwhebxbenxbwabizhy
2. Vá em: **Settings → API**
3. Na aba **"Legacy anon, service_role API keys"**, copie a chave `anon` (JWT longo)

---

### **Fix 2: Correção da Trigger do Banco de Dados**

**Arquivo criado:** `supabase_setup_v2.sql`

**Executado no Supabase SQL Editor** com as seguintes melhorias:

#### ✅ Tratamento de Erros Robusto
```sql
EXCEPTION
  WHEN invalid_text_representation THEN
    user_role_value := 'ATLETA'::user_role;
    RAISE LOG 'Invalid role for user %, defaulting to ATLETA', NEW.id;
```

#### ✅ Valores Padrão para Campos Opcionais
```sql
user_full_name := COALESCE(
  NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
  split_part(NEW.email, '@', 1),
  'Usuário'
);
```

#### ✅ Upsert com ON CONFLICT
```sql
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (...)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, ...
```

#### ✅ Permissões Corretas
```sql
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
```

---

## ✅ Verificação Final

### Teste de Cadastro:
```
Email: final@teste.com
Nome: Usuario Teste Final
Resultado: ✅ Sucesso
```

### Confirmação no Dashboard:
- Usuário criado em `auth.users` ✅
- Perfil criado em `public.profiles` ✅
- Display name correto ✅
- Role definido como ATLETA ✅

---

## 📁 Arquivos Criados/Modificados

### Modificados:
1. ✅ `.env` - Chave ANON_KEY corrigida
2. ✅ `src/stores/authStore.ts` - Logs de debug adicionados e depois removidos

### Criados (Scripts SQL):
1. ✅ `supabase_fix_trigger.sql` - Primeira tentativa de correção
2. ✅ `supabase_setup_complete.sql` - Script completo (com enum)
3. ✅ `supabase_setup_v2.sql` - **Script final usado** (sem enum duplicado)

---

## 📚 Lições Aprendidas

1. **Chaves Supabase:** Sempre usar a "Legacy API key" do tipo JWT longo, não a publishable key curta
2. **Triggers:** Sempre adicionar tratamento de erros em triggers para não bloquear a criação de usuários
3. **Permissões:** Garantir que `anon` e `authenticated` tenham permissão em todas as tabelas necessárias
4. **Debugging:** Console.logs estratégicos ajudam a identificar onde o erro ocorre

---

## 🎯 Status Atual

| Feature | Status |
|---------|--------|
| Cadastro (Sign Up) | ✅ Funcionando |
| Login (Sign In) | ✅ Funcionando* |
| Criação de Perfil | ✅ Funcionando |
| Autenticação Persistente | ✅ Funcionando |

*Nota: Login requer confirmação de email se habilitado nas configurações do Supabase

---

## 🔗 Links Úteis

- **Dashboard Supabase:** https://app.supabase.com/project/jvqwhebxbenxbwabizhy
- **SQL Editor:** https://app.supabase.com/project/jvqwhebxbenxbwabizhy/sql
- **Auth Settings:** https://app.supabase.com/project/jvqwhebxbenxbwabizhy/auth/providers
- **Database Tables:** https://app.supabase.com/project/jvqwhebxbenxbwabizhy/editor

---

**Desenvolvedor:** Leonardo Schweitzer  
**Assistente:** Antigravity AI  
**Conclusão:** 10/02/2026 15:49
