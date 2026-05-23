import { Composition } from 'remotion'
import { EuroCompareAd } from './EuroCompareAd'

export const Root: React.FC = () => (
  <Composition
    id="EuroCompareAd"
    component={EuroCompareAd}
    durationInFrames={600}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
)
