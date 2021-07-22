import React, {FC} from 'react';
import Svg, {Path, G} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

export const VerifiedUserIcon: FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 31.594 38">
      <G data-name="Group 394">
        <G data-name="Group 393">
          <G data-name="Group 389">
            <Path
              data-name="Path 1339"
              d="M15.797 26.977a11.575 11.575 0 1111.575-11.575 11.588 11.588 0 01-11.575 11.575z"
              fill="#984900"
            />
          </G>
          <Path data-name="Path 1340" d="M10.168 26.741V38l5.63-4.222L21.428 38V26.741z" fill="#f5ac09" />
          <G data-name="Group 392">
            <G data-name="Group 390">
              <Path
                data-name="Path 1341"
                d="M31.59 15.403l-2.438-3.051.876-3.8-3.523-1.685-.862-3.81h-3.905L19.309 0l-3.515 1.7L12.278 0 9.849 3.057H5.944l-.862 3.81-3.524 1.685.876 3.8-2.438 3.051 2.438 3.051-.876 3.8 3.524 1.685.862 3.81h3.905l2.429 3.057 3.516-1.7 3.515 1.7 2.429-3.057h3.905l.862-3.81 3.523-1.685-.876-3.8zm-15.8 9.85a9.849 9.849 0 119.85-9.85 9.849 9.849 0 01-9.843 9.847z"
                fill="#e6750e"
              />
            </G>
            <G data-name="Group 391">
              <Path
                data-name="Path 1342"
                d="M15.797 26.978a11.575 11.575 0 1111.575-11.575 11.588 11.588 0 01-11.575 11.575zm0-22.828A11.253 11.253 0 1027.05 15.403 11.266 11.266 0 0015.797 4.151z"
                fill="none"
                stroke="#984900"
              />
            </G>
          </G>
        </G>
        <Path
          data-name="Path 1338"
          d="M11.533 15.191L14.697 19l1.811-2.181 3.554-4.277"
          fill="none"
          stroke="#f5ac09"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
      </G>
    </Svg>
  );
};
