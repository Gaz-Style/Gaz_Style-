# 🏔️ Plan de Continuación - Gaz Style

Bienvenido a tu nueva sesión de trabajo exclusiva para **Gaz Style**. Ya hemos separado los proyectos para que operen de forma totalmente independiente a Elena Atelier.

Sigue estos pasos en orden para hacer que el sistema funcione por sí mismo. Puedes pedirme a mí (la IA) que ejecute cualquiera de estos pasos por ti en esta nueva sesión.

---

## PASO 1: Conectar la Base de Datos (Supabase)
Como ya creaste el nuevo proyecto en Supabase, necesitamos enlazarlo con el código.

1. Entra a tu proyecto de Supabase recién creado.
2. Ve a **Project Settings -> API**.
3. Copia la `URL` y la `anon public key`.
4. Abre el archivo `.env.local` en este proyecto (`gaz_style/.env.local`).
5. Pega tus claves reemplazando el texto de ejemplo. Debería quedar así:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-nueva-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-nueva-clave-anon
   ```

---

## PASO 2: Crear la Tabla de Reservas en Supabase
Actualmente, el formulario de la página web intenta guardar los datos en una tabla llamada `reservations`, pero esa tabla aún no existe en tu nuevo Supabase.

1. Ve al menú **SQL Editor** dentro de tu proyecto en Supabase.
2. Haz clic en "New Query".
3. Copia y pega el siguiente código SQL y presiona "Run":

```sql
-- Crear la tabla de reservas
CREATE TABLE reservations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  route text NOT NULL,
  full_name text NOT NULL,
  rut text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  experience_level text NOT NULL,
  trek_date date, -- Agregaremos este campo pronto en el frontend
  payment_status text DEFAULT 'pending' NOT NULL
);

-- Habilitar Políticas de Seguridad (RLS) para que el formulario web pueda insertar datos
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquier persona (anon) pueda insertar reservas desde el formulario
CREATE POLICY "Permitir inserción de reservas al público" 
ON reservations FOR INSERT 
TO public 
WITH CHECK (true);

-- Permitir que solo los administradores puedan ver las reservas (opcional por ahora, lo ajustaremos luego)
CREATE POLICY "Permitir lectura solo a admin" 
ON reservations FOR SELECT 
TO authenticated 
USING (true);
```

---

## PASO 3: Tareas de Código Pendientes (Pídemelas en el chat)
Una vez que el Paso 1 y 2 estén listos, dile a la IA en el chat que continúe con el plan. Las tareas que debemos programar son:

1. **Añadir el Calendario al Formulario:** Actualmente el usuario elige la ruta, pero necesitamos agregar un campo (`trek_date`) para que elija **qué día** quiere hacer la expedición.
2. **Crear el Panel de Administración (`/admin`):** Necesitamos crear la pantalla privada (protegida por contraseña) para ver todas las reservas que van cayendo en la base de datos.
3. **Integración Webpay:** Conectar Transbank para que después de llenar el formulario, el cliente pague su cupo.

> **Tip:** Cuando estés listo para empezar a trabajar en esto, simplemente escríbeme: *"IA, el paso 1 y 2 ya están listos, empecemos con el paso 3 (Añadir el calendario)"*.
