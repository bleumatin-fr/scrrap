import styled from '@emotion/styled';
import { Pie1D, Pie1DData, Project } from '@scrrap/core';
import { categoryIcons } from '../project/Nav';
import { ReactComponent as Identity } from '../ui/icons/categories/infos générales.svg';


const Container = styled.div`
  flex: 1;
  padding: 32px 32px 0;
  .percentage {
    font-size: 90px;
    font-weight: bold;
    line-height: 90px;
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const Explanation = ({
  resultsByCategories,
  project
}: {
  resultsByCategories: Pie1D;
  project: Project;
}) => {
  if (!resultsByCategories.data) return null;
  const total = resultsByCategories.data.reduce(
    (total, category) => total + category.value,
    0,
  );
  const { percentage, mainCategories } = getMainCategories(
    resultsByCategories.data,
    total,
  );
  return (
    <Container>
      <p className="h2b">Explanation</p>
      <p className="percentage">{percentage}%</p>
      <p className="hxb">of the footprint is carried by :</p>
      <Categories>
        {mainCategories.map((category) => (
          <Category
            category={category}
            total={total}
            unit={resultsByCategories.unit!}
            project={project}
          />
        ))}
      </Categories>
    </Container>
  );
};

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IconContainer = styled.div`
  height: 48px;
  width: 48px;
`;

const Category = ({
  project,
  category,
  total,
  unit,
}: {
  project: Project;
  category: Pie1DData;
  total: number;
  unit: string;
}) => {
  const firstCategoriesInformation = project.sectors.map(
    (sector) => sector.information,
  );
  const categoryInformation = firstCategoriesInformation.find((cat) => cat.name === category.name);
  const icon = categoryInformation ? categoryIcons[categoryInformation.icon] : <Identity />;
  const percentage = Math.round((category.value / total) * 100);
  return (
    <CategoryContainer>
        <IconContainer>{icon}</IconContainer>
      <p className="hxb">{category.name}</p>
      <p className="hzb">
        {category.value} {unit}
      </p>
      <p className="hzr">or {percentage}%</p>
    </CategoryContainer>
  );
};

const getMainCategories = (categories: Pie1DData[], total: number) => {
  const sortedCategories = categories.sort((a, b) => b.value - a.value);
  let cumulativeValue = 0;
  let cutoffIndex = 0;
  for (let i = 0; i < sortedCategories.length; i++) {
    cumulativeValue += sortedCategories[i].value;
    if (cumulativeValue >= total * 0.7) {
      cutoffIndex = i + 1;
      break;
    }
  }
  let percentage = Math.round((cumulativeValue / total) * 100);
  if (cutoffIndex > 3) {
    return {
      mainCategories: sortedCategories.slice(0, 3),
      percentage: percentage,
    };
  }
  return {
    mainCategories: sortedCategories.slice(0, cutoffIndex),
    percentage: percentage,
  };
};

export default Explanation;
