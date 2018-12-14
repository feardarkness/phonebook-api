'use strict';

const test = require('tape');
const filter = require('../../src/helpers/filter');

test('Filter one expression', t => {
  t.plan(1);
  const expressions = filter.findExpressions('(a gt 20)');
  t.equal(expressions[0], '(a gt 20)', 'Expression must be (a gt 20)');
});

test('Filter two expressions', t => {
  t.plan(4);
  const expressions = filter.findExpressions('(a gt 20) AND (b lt 50)');
  t.true(Array.isArray(expressions), 'Must be an array');
  t.equal(expressions[0], '(a gt 20)', 'Expression must be (a gt 20)');
  t.equal(expressions[1], ' AND ', 'Expression must be AND');
  t.equal(expressions[2], '(b lt 50)', 'Expression must be (b lt 50)');
});

test('Filter two expressions one after another', t => {
  t.plan(6);
  const expressions = filter.findExpressions('(a gt 20) AND (b lt 50) AND (c lt 80)');
  t.true(Array.isArray(expressions), 'Must be an array');
  t.equal(expressions[0], '(a gt 20)', 'Expression must be (a gt 20)');
  t.equal(expressions[1], ' AND ', 'Expression must be AND');
  t.equal(expressions[2], '(b lt 50)', 'Expression must be (b lt 50)');
  t.equal(expressions[3], ' AND ', 'Expression must be AND');
  t.equal(expressions[4], '(c lt 80)', 'Expression must be (c lt 80)');
});

test('Filter three expressions', t => {
  t.plan(4);
  const expressions = filter.findExpressions('(a gt 20) AND (b lt 50) OR (c eq 50)');
  t.true(Array.isArray(expressions), 'Must be an array');
  t.equal(expressions[0], '(a gt 20)', 'Expression must be (a gt 20)');
  t.equal(expressions[1], ' AND ', 'Expression must be AND');
  t.equal(expressions[2], '(b lt 50)', 'Expression must be (b lt 50)');
});

test('Filter unbalanced expressions', t => {
  t.plan(3);
  const expressions = filter.findExpressions('(a gt 20) AND ');
  t.true(Array.isArray(expressions), 'Must be an array');
  t.equal(expressions[0], '(a gt 20)', 'Expression must be (a gt 20)');
  t.equal(expressions[1], ' AND ', 'Expression must be AND');
});

test('Filter unbalanced expressions', t => {
  t.plan(1);
  t.throws(
    // eslint-disable-next-line
    function() {
      filter.findExpressions('(a gt 2');
    },
    'Unbalanced parens',
    'Must throw if parens not balanced',
  );
});

test('Filter unbalanced expressions', t => {
  t.plan(1);
  t.throws(
    // eslint-disable-next-line
    function() {
      filter.findExpressions('(a gt 2) ANTR ');
    },
    'Must throw',
    'Must throw if parens not balanced',
  );
});

test('Has more expressions', t => {
  t.plan(2);
  t.equal(filter.hasMoreExpressions('(a eq b)'), false, 'should not have nested expressions');
  t.equal(filter.hasMoreExpressions('((a eq b) OR (c eq d))'), true, 'should not have nested expressions');
});

test('Parse', t => {
  t.plan(7);
  const exp1 = filter.makeFilter('(a eq b) AND (b eq c)');
  t.deepEquals(
    exp1,
    {
      $and: [
        {
          a: {
            $eq: 'b',
          },
        },
        {
          b: {
            $eq: 'c',
          },
        },
      ],
    },
    'Should generate basic and operators',
  );

  const exp2 = filter.makeFilter('(a eq b) AND (b eq c) AND (d eq e)');
  t.deepEquals(
    exp2,
    {
      $and: [
        {
          a: {
            $eq: 'b',
          },
        },
        {
          b: {
            $eq: 'c',
          },
        },
        {
          d: {
            $eq: 'e',
          },
        },
      ],
    },
    'Should generate logical operator for three ANDs',
  );

  const exp3 = filter.makeFilter('(a eq b) OR (b eq c) OR (d eq e)');
  t.deepEquals(
    exp3,
    {
      $or: [
        {
          a: {
            $eq: 'b',
          },
        },
        {
          b: {
            $eq: 'c',
          },
        },
        {
          d: {
            $eq: 'e',
          },
        },
      ],
    },
    'Should generate logical operator for three ORs',
  );

  const exp4 = filter.makeFilter('((a eq b) OR (b eq c)) AND (d eq e)');
  t.deepEquals(
    exp4,
    {
      $and: [
        {
          $or: [
            {
              a: {
                $eq: 'b',
              },
            },
            {
              b: {
                $eq: 'c',
              },
            },
          ],
        },
        {
          d: {
            $eq: 'e',
          },
        },
      ],
    },
    'Should generate logical operator for AND with nested OR, OR first',
  );

  const exp5 = filter.makeFilter('(a eq b) AND ((b eq c) OR (d eq e))');
  t.deepEquals(
    exp5,
    {
      $and: [
        {
          a: {
            $eq: 'b',
          },
        },
        {
          $or: [
            {
              b: {
                $eq: 'c',
              },
            },
            {
              d: {
                $eq: 'e',
              },
            },
          ],
        },
      ],
    },
    'Should generate logical operator for AND with nested OR, AND first',
  );

  const exp6 = filter.makeFilter('(a eq b) AND ((b eq c) OR ((q eq w) AND (e eq r)))');
  t.deepEquals(
    exp6,
    {
      $and: [
        {
          a: {
            $eq: 'b',
          },
        },
        {
          $or: [
            {
              b: {
                $eq: 'c',
              },
            },
            {
              $and: [
                {
                  q: {
                    $eq: 'w',
                  },
                },
                {
                  e: {
                    $eq: 'r',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    'Should generate logical operator for AND with nested OR with nested AND',
  );

  const exp7 = filter.makeFilter('(a eq b)');
  t.deepEquals(exp7, { a: { $eq: 'b' } }, 'Should generate basic ops');
});
