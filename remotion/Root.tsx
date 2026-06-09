import { Composition } from 'remotion'
import { CompareUroAd } from './CompareUroAd'

export const Root: React.FC = () => (
  <Composition
    id="CompareUroAd"
    component={CompareUroAd}
    durationInFrames={600}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
)
