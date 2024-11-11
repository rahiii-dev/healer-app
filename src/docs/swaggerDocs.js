import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const loadYamlFile = (filePath) => yaml.load(fs.readFileSync(filePath, 'utf8'));

// Load all YAML files from a directory into an object for schemas
const loadSchemasFromDir = (directory) => {
  const schemas = {};
  fs.readdirSync(directory).forEach((file) => {
    if (file.endsWith('.yaml')) {
      const schemaName = path.basename(file, '.yaml');
      schemas[schemaName] = loadYamlFile(path.join(directory, file));
    }
  });
  return schemas;
};

// Load all YAML files from a directory into an object for paths
const loadPathsFromDir = (directory) => {
  const paths = {};
  fs.readdirSync(directory).forEach((file) => {
    if (file.endsWith('.yaml')) {
      const pathContent = loadYamlFile(path.join(directory, file));
      Object.assign(paths, pathContent); 
    }
  });
  return paths;
};

// Function to merge the main swagger spec with schemas and paths
export const mergeSwaggerDocs = () => {
  const baseDir = path.resolve('./docs');

  //components
  const authDir = path.join(baseDir, 'components', 'schemas', 'auth');
  const therapistDir = path.join(baseDir, 'components', 'schemas', 'therapist');
  const responseDir = path.join(baseDir, 'components', 'responses');

  //paths
  const pathsDir = path.join(baseDir, 'paths');

  const baseSpec = loadYamlFile(path.join(baseDir, 'swagger.yaml'));

  // Load all schemas and add them to the base spec
  baseSpec.components = baseSpec.components || {};
  baseSpec.components.schemas = {
    ...baseSpec.components.schemas,
    ...loadSchemasFromDir(authDir),
    ...loadSchemasFromDir(therapistDir),
  };
  baseSpec.components.responses = {
    ...baseSpec.components.responses,
    ...loadSchemasFromDir(responseDir),
  };

  // Load all paths and add them to the base spec
  baseSpec.paths = {
    ...baseSpec.paths,
    ...loadPathsFromDir(pathsDir),
  };

  return baseSpec;
};
