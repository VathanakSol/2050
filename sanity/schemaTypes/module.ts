import { defineField, defineType } from 'sanity'

export const moduleSchema = defineType({
    name: 'module',
    title: 'Module',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Module Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'lessons',
            title: 'Lessons',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'lesson' } }],
        }),
    ],
})
