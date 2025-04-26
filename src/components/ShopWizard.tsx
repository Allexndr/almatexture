import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextureViewer from './TextureViewer';

const schema = yup.object().shape({
  texture: yup.string().required('Выберите текстуру'),
  color: yup.string().required('Выберите цвет'),
  size: yup.string().required('Выберите размер'),
  customText: yup.string().max(30, 'Максимум 30 символов'),
});

type FormData = yup.InferType<typeof schema>;

const colors = [
  { name: 'Белый', value: 'white', hex: '#FFFFFF' },
  { name: 'Черный', value: 'black', hex: '#000000' },
  { name: 'Серый', value: 'gray', hex: '#808080' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ShopWizard() {
  const [step, setStep] = useState(1);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const selectedColor = watch('color');

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // TODO: Implement order creation
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center ${
                s < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Текстура</span>
          <span>Цвет</span>
          <span>Размер</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-4">
              Выберите текстуру
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder for texture selection */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`aspect-square rounded-lg cursor-pointer ${
                    selectedTexture === `texture-${item}`
                      ? 'ring-2 ring-primary-500'
                      : 'hover:ring-2 hover:ring-primary-300'
                  }`}
                  onClick={() => setSelectedTexture(`texture-${item}`)}
                >
                  <div className="w-full h-full bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
            {errors.texture && (
              <p className="text-red-500 text-sm">{errors.texture.message}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-4">
              Выберите цвет
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {colors.map((color) => (
                <label
                  key={color.value}
                  className={`flex items-center space-x-2 p-4 rounded-lg cursor-pointer ${
                    selectedColor === color.value
                      ? 'ring-2 ring-primary-500'
                      : 'hover:ring-2 hover:ring-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={color.value}
                    {...register('color')}
                    className="hidden"
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </label>
              ))}
            </div>
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color.message}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-4">
              Выберите размер
            </h2>
            <div className="grid grid-cols-6 gap-4">
              {sizes.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center p-4 rounded-lg cursor-pointer ${
                    watch('size') === size
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    value={size}
                    {...register('size')}
                    className="hidden"
                  />
                  {size}
                </label>
              ))}
            </div>
            {errors.size && (
              <p className="text-red-500 text-sm">{errors.size.message}</p>
            )}

            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Добавить текст (опционально)
              </label>
              <input
                type="text"
                {...register('customText')}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Максимум 30 символов"
              />
              {errors.customText && (
                <p className="text-red-500 text-sm">
                  {errors.customText.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Назад
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Далее
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Заказать
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 