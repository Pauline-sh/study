import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import html from 'rollup-plugin-html';
import livereload from 'rollup-plugin-livereload'
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import serve from 'rollup-plugin-serve';

const getPlugins = (options) => [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    html(),
    livereload({
      watch: 'dist'
    }),
    postcss({
      extensions: ['.css']
    }),
    replace({
      'process.env.NODE_ENV': '"production"',
    }),
    serve({
      open: true,
      contentBase: ['dist', '../static']
    }),
];

export default {
    input: './src/index.js',
    output: {
        file: './dist/index.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: getPlugins({
      target: 'es3',
    })
}
