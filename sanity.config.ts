'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'

import { codeInput } from '@sanity/code-input'

export default defineConfig({
    basePath: '/studio',
    projectId: projectId || '',
    dataset: dataset || '',
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    plugins: [
        structureTool(),
        codeInput(),
    ],
})
