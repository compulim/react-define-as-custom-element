import React, { useCallback, useState } from 'react';
import { defineAsCustomElement, useMethodCallback } from 'react-define-as-custom-element';

type Props = { operator?: string | undefined };

const MyCalculator = ({ operator }: Props) => {
  const [variables, setVariables] = useState<[number, number]>([0, 0]);

  useMethodCallback(
    'compute',
    useCallback(
      operator === 'multiply'
        ? (left: number, right: number): number => {
            const answer = left * right;

            setVariables([left, right]);

            return answer;
          }
        : (left: number, right: number): number => {
            const answer = left + right;

            setVariables([left, right]);

            return answer;
          },
      [operator, setVariables]
    )
  );

  const [left, right] = variables;

  return (
    <span>
      {left} {operator === 'multiply' ? '*' : '+'} {right} = {operator === 'multiply' ? left * right : left + right}
    </span>
  );
};

defineAsCustomElement(MyCalculator, 'use-method-callback-update--my-calculator', { operator: 'operator' });
