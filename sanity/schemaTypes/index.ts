import { type SchemaTypeDefinition } from 'sanity'

import post from './post'
import { course } from './course'
import { moduleSchema } from './module'
import { lesson } from './lesson'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [post, course, moduleSchema, lesson],
}
