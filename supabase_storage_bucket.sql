-- Crear bucket público para imágenes de rutas
INSERT INTO storage.buckets (id, name, public)
VALUES ('route-images', 'route-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquiera puede ver las imágenes (lectura pública)
CREATE POLICY "route-images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'route-images');

-- Política: solo service_role puede subir (admin interno)
CREATE POLICY "route-images service upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'route-images');

CREATE POLICY "route-images service delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'route-images');
