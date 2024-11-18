// monaco.languages.setMonarchTokensProvider('python', {
//   defaultToken: '',
//   tokenPostfix: '.python',

//   keywords: [
//     'and',
//     'as',
//     'assert',
//     'break',
//     'class',
//     'continue',
//     'def',
//     'del',
//     'elif',
//     'else',
//     'except',
//     'exec',
//     'finally',
//     'for',
//     'from',
//     'global',
//     'if',
//     'import',
//     'in',
//     'is',
//     'lambda',
//     'not',
//     'or',
//     'pass',
//     'print',
//     'raise',
//     'return',
//     'try',
//     'while',
//     'with',
//     'yield',
//     'async',
//     'await',
//     'None',
//     'True',
//     'False',
//   ],

//   brackets: [
//     { open: '{', close: '}', token: 'delimiter.curly' },
//     { open: '[', close: ']', token: 'delimiter.square' },
//     { open: '(', close: ')', token: 'delimiter.parenthesis' },
//   ],

//   tokenizer: {
//     root: [
//       { include: '@whitespace' },
//       { include: '@numbers' },
//       { include: '@strings' },

//       [/[,:;]/, 'delimiter'],
//       [/[{}\[\]()]/, '@brackets'],

//       [/@[a-zA-Z]\w*/, 'tag'],
//       [
//         /[a-zA-Z]\w*/,
//         {
//           cases: {
//             '@keywords': 'keyword',
//             '@default': 'identifier',
//           },
//         },
//       ],
//     ],

//     whitespace: [
//       [/\s+/, 'white'],
//       [/(^#.*$)/, 'comment'],
//     ],

//     numbers: [
//       [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
//       [/0[xX][0-9a-fA-F]+/, 'number.hex'],
//       [/\d+/, 'number'],
//     ],

//     strings: [
//       [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
//       [/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
//     ],

//     string_single: [
//       [/[^']+/, 'string'],
//       [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
//     ],

//     string_double: [
//       [/[^"]+/, 'string'],
//       [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
//     ],
//   },
// });
