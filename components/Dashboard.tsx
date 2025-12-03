import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { SupabaseCar } from '../types';
import { LogOut, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Dashboard: React.FC = () => {
  const [cars, setCars] = useState<SupabaseCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState<SupabaseCar | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchCars();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@trevi.com') {
      navigate('/login');
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (err: any) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCars();
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  };

  const handleEdit = (car: SupabaseCar) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Panel d'Administration - Trevi Rental
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Gestion des Véhicules ({cars.length})
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            <span>Ajouter un Véhicule</span>
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={car.image_url}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {car.brand} {car.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Prix:</span> {car.price_per_day} MAD/jour</p>
                  <p><span className="font-medium">Carburant:</span> {car.fuel_type}</p>
                  <p><span className="font-medium">Transmission:</span> {car.gearbox}</p>
                  <p><span className="font-medium">Catégorie:</span> {car.category}</p>
                  <p>
                    <span className="font-medium">Disponible:</span>{' '}
                    <span className={car.is_available ? 'text-green-600' : 'text-red-600'}>
                      {car.is_available ? 'Oui' : 'Non'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Edit size={16} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun véhicule enregistré</p>
          </div>
        )}
      </main>

      {/* Add Car Modal */}
      {showAddModal && (
        <CarFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCars();
          }}
        />
      )}

      {/* Edit Car Modal */}
      {showEditModal && editingCar && (
        <CarFormModal
          car={editingCar}
          onClose={() => {
            setShowEditModal(false);
            setEditingCar(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingCar(null);
            fetchCars();
          }}
        />
      )}
    </div>
  );
};

// Car Form Modal Component
interface CarFormModalProps {
  car?: SupabaseCar;
  onClose: () => void;
  onSuccess: () => void;
}

const CarFormModal: React.FC<CarFormModalProps> = ({ car, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: car?.name || '',
    brand: car?.brand || '',
    price_per_day: car?.price_per_day || 0,
    fuel_type: car?.fuel_type || 'Essence',
    gearbox: car?.gearbox || 'Manuelle',
    category: car?.category || 'Berline',
    is_available: car?.is_available ?? true,
    description: car?.description || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(car?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = fileName;

      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // If file already exists, try with a different name
        if (uploadError.message.includes('already exists') || uploadError.message.includes('duplicate')) {
          const newFileName = `${timestamp}-${randomStr}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const { data: retryData, error: retryError } = await supabase.storage
            .from('car-images')
            .upload(newFileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (retryError) {
            console.error('Retry upload error:', retryError);
            throw new Error(`Erreur lors du téléchargement de l'image: ${retryError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(newFileName);
          
          if (!publicUrl) {
            throw new Error('Impossible d\'obtenir l\'URL publique de l\'image');
          }
          
          return publicUrl;
        }
        
        // Handle permission errors
        if (uploadError.message.includes('permission') || uploadError.message.includes('policy') || uploadError.message.includes('403')) {
          throw new Error('Erreur de permissions. Vérifiez que le bucket "car-images" autorise les téléchargements pour les utilisateurs authentifiés.');
        }
        
        throw new Error(`Erreur lors du téléchargement: ${uploadError.message}`);
      }

      // Verify upload succeeded
      if (!uploadData) {
        throw new Error('Le téléchargement a échoué - aucune donnée retournée');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Impossible d\'obtenir l\'URL publique de l\'image téléchargée');
      }

      return publicUrl;
    } catch (err: any) {
      console.error('Error in uploadImage:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = car?.image_url || '';

      // Upload new image if provided
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
          console.log('Image uploaded successfully, URL:', imageUrl);
        } catch (uploadErr: any) {
          console.error('Failed to upload image:', uploadErr);
          setError(uploadErr.message || 'Erreur lors du téléchargement de l\'image');
          setLoading(false);
          return; // Stop here if image upload fails
        }
      }

      const carData = {
        name: formData.name,
        brand: formData.brand,
        price_per_day: Number(formData.price_per_day),
        fuel_type: formData.fuel_type,
        gearbox: formData.gearbox,
        category: formData.category,
        is_available: formData.is_available,
        description: formData.description || null,
        image_url: imageUrl, // Always include image_url, whether new or existing
      };

      if (car) {
        // Update existing car
        const { data, error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', car.id)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          throw new Error('Aucune donnée retournée après la mise à jour');
        }
        
        console.log('Car updated successfully:', data);
      } else {
        // Create new car
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Erreur lors de la création: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          throw new Error('Aucune donnée retournée après la création');
        }
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du véhicule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {car ? 'Modifier le Véhicule' : 'Ajouter un Véhicule'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Modèle *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix par Jour (MAD) *
              </label>
              <input
                type="number"
                value={formData.price_per_day}
                onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Carburant *
              </label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Électrique">Électrique</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <select
                value={formData.gearbox}
                onChange={(e) => setFormData({ ...formData, gearbox: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="Berline">Berline</option>
                <option value="SUV">SUV</option>
                <option value="Citadine">Citadine</option>
                <option value="Luxe">Luxe</option>
                <option value="4x4">4x4</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Disponible</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {car && '(optionnel - laissez vide pour conserver l\'actuelle)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{car ? 'Mettre à jour' : 'Ajouter'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
