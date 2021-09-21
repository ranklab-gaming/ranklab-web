// layouts
import MainLayout from 'src/layouts/main';
// material
import { styled } from '@material-ui/core/styles';
// components
import Page from 'src/components/Page';
import {
  LandingHero,
  LandingMinimal,
  LandingDarkMode,
  LandingHugePackElements,
} from 'src/components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%',
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <MainLayout>
      <RootStyle
        title='Be the better gamer | Ranklab'
        id='move_top'
      >
        <LandingHero />
        <ContentStyle>
          <LandingMinimal />
          <LandingHugePackElements />
          <LandingDarkMode />
        </ContentStyle>
      </RootStyle>
    </MainLayout>
  );
}
