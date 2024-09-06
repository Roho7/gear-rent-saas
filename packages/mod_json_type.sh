#!/bin/bash

# Define the path to the TypeScript file
filePath="./supabase.types.ts"

# Read the content of the file as a single string
fileContent=$(cat "$filePath")

# Define the current and new type definitions using Perl-style regular expressions
oldTypeDefinition='export type Json =\s*\| string\s*\| number\s*\| boolean\s*\| null\s*\| \{ \[key: string\]: Json \| undefined \}\s*\| Json\[\]'
newTypeDefinition='export type Json = { [key: string]: any } | any'

# Replace the old type definition with the new one
updatedContent=$(echo "$fileContent" | perl -0777 -pe "s/$oldTypeDefinition/$newTypeDefinition/g")

# Update interface to type
oldText='export interface Database '
newText='export type Database = '

updatedContent=$(echo "$updatedContent" | sed "s/$oldText/$newText/g")

# Write the updated content back to the file
echo "$updatedContent" > "$filePath"