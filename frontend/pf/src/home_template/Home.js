import * as React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import ProductSmokingHero from './modules/views/ProductSmokingHero';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductValues from './modules/views/ProductValues';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import ProductCTA from './modules/views/ProductCTA';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Pricing from "../templates/PlanPricingHome";
import Box from "@mui/material/Box"

function Index() {
  return (
    <React.Fragment>
      {/* <AppAppBar /> */}
      <ProductHero />
      {/* <ProductValues /> */}
      <ProductCategories />
      <div className='my-10'></div>
      {/* <ProductHowItWorks /> */}
      <Box
      component="section"
      sx={{ bgcolor: 'secondary.light'}}
      pb={7}
      pt={2}
      >
        <Pricing />
      </Box>
      <div className='my-32'></div>
      <ProductCTA />
      <ProductSmokingHero />
      {/* <AppFooter /> */}
    </React.Fragment>
  );
}

export default withRoot(Index);
