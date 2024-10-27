declare module 'react-step-progress-bar' {
  import { ReactNode } from 'react';

  interface ProgressBarProps {
    percent: number;
    filledBackground?: string;
    height?: string;
    stepPositions?: number[];
    children?: ReactNode;
  }

  interface StepProps {
    children: (props: {
      accomplished: boolean;
      position: number;
      index: number;
    }) => ReactNode;
    position?: number;
  }

  export class ProgressBar extends React.Component<ProgressBarProps> {}
  export class Step extends React.Component<StepProps> {}
}
