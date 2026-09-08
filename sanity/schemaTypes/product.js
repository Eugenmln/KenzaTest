import { defineField, defineType } from 'sanity'

const productCategories = [
  'Remeras',
  'Camisas',
  'Chombas',
  'Buzos',
  'Jeans',
  'Pantalones',
  'Shorts',
  'Accesorios',
  'Otros',
]

export const productType = defineType({
  name: 'product',
  title: 'Productos',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: productCategories },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'price', title: 'Precio', type: 'number', validation: (Rule) => Rule.required().positive() }),
    defineField({ name: 'shortDescription', title: 'Descripción corta', type: 'string', validation: (Rule) => Rule.max(120) }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
    defineField({
      name: 'images',
      title: 'Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: 'colors', title: 'Colores disponibles', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'sizes', title: 'Talles disponibles', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'available', title: 'Disponible', type: 'boolean', initialValue: true }),
    defineField({ name: 'isNew', title: 'Marcar como NEW', type: 'boolean', initialValue: false }),
    defineField({ name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'visible', title: 'Visible en la web', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'images.0' },
  },
})
