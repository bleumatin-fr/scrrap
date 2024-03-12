import styled from '@emotion/styled';
import { Indicator } from '@scrrap/core';

export const synthesisIllustrations = [
  {
    image: '/equivalence/washingMachine.png',
    color: '#3B76B5',
    tCO2eq: 0.0000569,
    mainText: 'washing machine cycles',
    secondary: '',
    source:
      "ADEME (France)",
  },
  {
    image: '/equivalence/paris-ny.svg',
    color: '#E9B64F',
    tCO2eq: 1,
    mainText: 'return journey Paris > New-York',
    secondary: 'for one person traveling by plane',
    source: "Direction Générale de l'Aviation Civile",
  },
  {
    image: '/equivalence/french-person.svg',
    color: '#E34229',
    tCO2eq: 0.027,
    mainText: 'days of a french person',
    secondary: '',
    source: "Carbone 4",
  },
  {
    image: '/equivalence/beaf.svg',
    color: '#E32982',
    tCO2eq: 0.0068,
    mainText: '200g beaf steacks',
    secondary: '',
    source: "ADEME (France)",
  },
  {
    image: '/equivalence/appartment.svg',
    color: '#878787',
    tCO2eq: 0.1166,
    mainText: 'months of a 30m² appartment',
    secondary: '(in France)',
    source: "ADEME (France)",
  },
  {
    image: '/equivalence/house.svg',
    color: '#40AC9A',
    tCO2eq: 3.5,
    mainText: 'years of a 100m² house',
    secondary: '(in France)',
    source: "ADEME (France)",
  },
  {
    image: '/equivalence/food.svg',
    color: '#61C3C9',
    tCO2eq: 0.136,
    mainText: 'months of a classical diet',
    secondary: '',
    source: "ADEME (France)",
  },
];

interface IllustrationType {
  image: string;
  color: string;
  tCO2eq: number;
  mainText: string;
  secondary: string;
  source: string;
}

const getRandomIndexOfArray = (arrayLength: number) => {
  if (arrayLength === 0) return null;
  return Math.floor(Math.random() * arrayLength)
}

export const getIllustration = (indicator: Indicator) => {
  if (!indicator || !indicator.number) return null;
  const number = parseFloat(indicator.number);
  const interestingIllustrations = synthesisIllustrations.filter((illu) => number / 1000 > 3 * illu.tCO2eq  && number / 1000 < 1000 * illu.tCO2eq)
  const index = getRandomIndexOfArray(interestingIllustrations.length)
  return index ? interestingIllustrations[index] : interestingIllustrations[0];
};

const Container = styled.div`
  flex: 2;
  padding: 32px 32px 0;
  border-left: 1px solid black;
`;

const Content = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  img {
    max-width: 300px;
    max-height: 300px;
  }
  .source {
    margin-top: 16px;
  }
`;

const Illustration = ({
  illustration,
  indicator,
}: {
  illustration: IllustrationType;
  indicator: Indicator;
}) => {
  if (!indicator.number) return null;
  const number = Math.round(
    (parseFloat(indicator.number) / 1000) / illustration.tCO2eq,
  );
  return (
    <Container>
      <p className="h2b">Equivalence</p>
      <Content>
        <img src={illustration.image} alt="illustration" />
        <div>
          <p className="h1b">{number}</p>
          <p className="h2r">{illustration.mainText}</p>
          <p className="h5r">{illustration.secondary}</p>
          <p className="hzr source">
            <b>Source:</b> {illustration.source}
          </p>
        </div>
      </Content>
    </Container>
  );
};

export default Illustration;
