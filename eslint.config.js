import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.js'],
        plugins: {
        lit: litPlugin,
        wc: wcPlugin,
        },
        rules: {
        // Reglas generales
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_' 
        }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        
        // Reglas para LitElement
        'lit/no-invalid-html': 'error',
        'lit/no-useless-template-literals': 'error',
        'lit/attribute-value-entities': 'error',
        'lit/binding-positions': 'error',
        'lit/no-property-change-update': 'error',
        
        // Reglas para Web Components
        'wc/no-invalid-element-name': 'error',
        'wc/no-self-class': 'error',
        'wc/guard-super-call': 'error',
        
        // Estilo
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        },
        languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        globals: {
            window: 'readonly',
            document: 'readonly',
            console: 'readonly',
            navigator: 'readonly',
        },
        },
    },
    {
        files: ['test/**/*.js', '**/*.test.js'],
        rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-expressions': 'off',
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'public/**', 'coverage/**'],
    }
);