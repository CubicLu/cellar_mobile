import * as React from 'react';
import Svg, {Path, Defs, Pattern, Use, Image} from 'react-native-svg';

type Props = {width: number; height: number};

const X: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 57" fill="none">
      <Path fill="url(#prefix__pattern0)" d="M0 0h60v57H0z" />
      <Defs>
        <Pattern id="prefix__pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <Use xlinkHref="#prefix__image0" transform="scale(.01667 .01754)" />
        </Pattern>
        <Image
          id="prefix__image0"
          width={60}
          height={57}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA5CAQAAADAOIBKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfkBhgRHhsYLEaQAAADbElEQVRYw7WZTUhVQRTHz0141Atx5c5FkEGWGbgRW75VUNgmCQy0QoqysFUYriu3FeKmwogyFIMyXAS5MxDpUzAssY3QQqjsQ9DUX4vr0/fenTl35r3bmd29/3N+b+bOnDkzTxACWplklb+85SwB8l/aMUaY4zMDNCCIsI0H5NoT0olDU9zLIaxzBRE6KLQxdiaMfRZhHBamidoEFYlh04wZCC+FdUz2nspEsBW8MsZfEH5jto9UlYyt5LUl+ldhCJvNUl0Stoopa+wBoYZf1tfz1BSN3cWsNe4StYKQsQ43LHCwKOwe5q0xV2hCQlkDi1bZYrjgvdoBFpTeZpAsWKhTpH9CqXNr4IfSjUOhaku+VxmcJZqcsRl+Kh+uPqvLddmtTIcVTjhhj7CkTNXaLWXhApi2uq1xOhZ7nBWr/5f8xRld8u+w20UV28qa1fNTYTqKulcwoaC7rNjzitdUNAGbQpjTetZ6jNguxcO45Zh//Q7DRrZlvZFi4ZqiHqPcxLANXIrHSrB+yjaVATcV5XNbWWGfKmV5VUOhDZLaUN1RVEMbKi+wEHBbCTpCmhSPFMX9nHHxAgvCDfXr+c0EL7A+X+3WExc3HmwqB+PsanxUF7DQpuSkqF1yiekGFpqVLJxra5xxi+gKFo4q+07WXPcwL7CQUaoz8Nu1vcDCKRV82SeWD1arzMCzREpuoD0HO8mp5TW93LCuiylcUPElkiPYL32AUwqJx17whIYWmzTjsHpJ418iOYKvK4HHqCDNqKJQN0Y7NOCWEnR0o6RJMayo+u2lgA1bxl0l4HBOSVNWcHmTb4O24seMTTGgBHtQ0I+APkVtKfdM2O1qSdNn+HIBPepsKHcBF1POC0K34mUo6Qvd9QNMt7oGOhXPyCEm31U/snXGJpt2JcfN5B/bct30Q2p7LFYQWlwPqlsu+rG8xQkrCE0sW+PkHM2zcu0iYtmnpEHIKFvo5mVEKK2Lv6Xxao3qLVJjFtwQL/Nu9XFdEXbxLX5gimi1ysf7zT5RcvI8+4vGCkI1c9bYw2L9XXMlXqGGC3TG1mfhu/HFTAKXxoJQabnBXRfGDY+nEromF2xJeFo4GXmY5B8DglBu2HY6BKE379EL8y1NSS3N0zzGQ4LwRTPjLLPKBzq1e4sSWsA53rDKXyZpI0D+Af7WztDyMnvdAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  );
};

export const CloseIcon = X;
