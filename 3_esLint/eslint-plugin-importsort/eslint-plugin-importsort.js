'use strict'

module.exports = {
  meta: {
    fixable: 'code'
  },

  create(context) {
    const sourceCode = context.getSourceCode()

    function isScopedImport(path) {
      return /^@[^/]+\/.+/.test(path)
    }

    function isRelativeImport(path) {
      return /^\.\.?(\/|$)/.test(path)
    }

    function isDynamicImport(node) {
      return node.type === 'ImportExpression'
    }

    function isNpmImport(path) {
      return !isScopedImport(path) && !isRelativeImport(path)
    }

    function getImportPath(node) {
      return node.source.value
    }

    function getImportType(path) {
      if (isScopedImport(path)) {
        return 'scoped'
      } else if (isNpmImport(path)) {
        return 'npm'
      } else if (isRelativeImport(path)) {
        return 'relative'
      } else {
        return 'unknown'
      }
    }

    function getImportGroup(node) {
      const path = getImportPath(node)
      const type = getImportType(path)

      switch (type) {
        case 'scoped':
        case 'npm':
          return 1
        case 'relative':
          return path.startsWith('./') ? 4 : 3
        default:
          return 5
      }
    }

    function getImportSortKey(node) {
      const path = getImportPath(node)
      const type = getImportType(path)

      switch (type) {
        case 'scoped':
        case 'npm':
          return path
        case 'relative':
          return path.startsWith('./') ? path : `./${path}`
        default:
          return ''
      }
    }

    function getImportComments(node) {
      const leadingComments = sourceCode.getCommentsBefore(node)
      const trailingComments = sourceCode.getCommentsAfter(node)

      return [...leadingComments, ...trailingComments]
        .sort((a, b) => a.loc.start.line - b.loc.start.line)
    }

    function sortImports(imports) {
      return imports.sort((a, b) => {
        const groupA = getImportGroup(a)
        const groupB = getImportGroup(b)

        if (groupA !== groupB) {
          return groupA - groupB
        }

        const sortKeyA = getImportSortKey(a)
        const sortKeyB = getImportSortKey(b)

        if (sortKeyA !== sortKeyB) {
          return sortKeyA.localeCompare(sortKeyB)
        }

        return a.start - b.start
      })
    }

    function fixImports(node, imports) {
      const sortedImports = sortImports(imports);
      const importStatements = sortedImports.map((importNode) => sourceCode.getText(importNode));
      const comments = getImportComments(node);
      const commentStatements = comments.map((commentNode) => sourceCode.getText(commentNode));
      const newCode = [...importStatements, ...commentStatements].join('\n');
      const codeWithEmptyLines = newCode.replace(/\n\n/g, '\n\n');
      context.report({
        node,
        message: 'Imports should be sorted',
        fix(fixer) {
          return fixer.replaceText(node, codeWithEmptyLines);
        },
      });
    }


    return {
      ImportDeclaration(node) {
        if (isDynamicImport(node)) {
          return
        }

        const imports = node.specifiers
        fixImports(node, imports)
      }
    }
  }
}
