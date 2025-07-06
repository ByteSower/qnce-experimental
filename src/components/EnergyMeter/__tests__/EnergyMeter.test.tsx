import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EnergyMeter } from '../EnergyMeter';

describe('EnergyMeter Component', () => {
  test('renders without crashing', () => {
    render(<EnergyMeter />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays progress bar and buttons', () => {
    render(<EnergyMeter />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /harvest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { container } = render(<EnergyMeter />);
    expect(container.firstChild).toMatchSnapshot();
  });
});