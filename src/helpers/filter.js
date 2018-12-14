'use strict';

const ValidationError = require('../errors/validation-error');

function isExpressionOver(character, parenthesis) {
  if (character === '(') {
    parenthesis.push(character);
  } else if (character === ')') {
    const previous = parenthesis.pop();
    if (previous === '(') {
      if (parenthesis.length === 0) {
        return true;
      }
    } else {
      throw new ValidationError('Malformed filter');
    }
  }
  return false;
}

function isLogicalOperatorOver(expr) {
  return expr === ' AND ' || expr === ' OR ';
}

const findExpressions = param => {
  const parenthesis = [];
  const expressions = [];
  let expr = '';
  let findExpresion = true;
  param.split('').forEach(character => {
    expr += character;
    if (findExpresion) {
      if (isExpressionOver(character, parenthesis)) {
        expressions.push(expr);
        expr = '';
        findExpresion = false;
      }
    } else if (isLogicalOperatorOver(expr)) {
      expressions.push(expr);
      expr = '';
      findExpresion = true;
    }
  });
  if (parenthesis.length !== 0 || expr !== '') {
    throw new ValidationError('Malformed filter');
  }
  return expressions;
};

/**
 * Check if exprs has neted expressions
 * @param {string} exprs
 */
const hasMoreExpressions = exprs => {
  const parenRegex = new RegExp('\\(', 'g');
  const parenCount = exprs.match(parenRegex);
  return parenCount.length > 2;
};

const baseCondition = exp => {
  const [a, operator, b] = exp.substring(1, exp.length - 1).split(' ');
  const logicalOperators = {
    eq: '$eq',
    neq: '$neq',
    gt: '$gt',
    lt: '$lt',
  };
  const condition = {};
  condition[a] = {};
  condition[a][logicalOperators[operator]] = b;
  return condition;
};

const build = exp => {
  if (hasMoreExpressions(exp)) {
    return makeFilter(exp.substring(1, exp.length - 1)); // eslint-disable-line
  }
  return baseCondition(exp);
};

const makeFilter = params => {
  const expressions = findExpressions(params);
  if (expressions.length % 2 === 0) {
    throw new ValidationError('Malformed filter');
  }
  if (expressions.length === 1) {
    return build(expressions[0]);
  }
  let logicalOperator = '$or';
  if (expressions[1] === ' AND ') {
    logicalOperator = '$and';
  }
  const exp = {};
  exp[logicalOperator] = [];
  expressions.forEach((expr, i) => {
    if (i % 2 === 0) {
      exp[logicalOperator].push(build(expr));
    }
  });
  return exp;
};

module.exports = {
  findExpressions,
  makeFilter,
  hasMoreExpressions,
};
