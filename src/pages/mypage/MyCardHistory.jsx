import styled from "styled-components";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";
import fontSet from "../../styles/fonts";

import BackBtn from "../../components/button/BackBtn";
import FilterDropdown from "../../components/mypage/FilterDropdown";
import ProgressBar from "../../components/mypage/ProgressBar";
import HistoryList from "../../components/mypage/HistoryList";
import { useParams } from "react-router-dom";
import { useState } from "react";

const cards = [
  {
    id: 1,
    name: "HJW BABO 체크",
    nickname: "카드 별칭띠예",
    linkedAccount: "111-234-5678",
  },
  {
    id: 2,
    name: "MUKJJANG 체크",
    nickname: "쩝쩝박사",
    linkedAccount: "777-654-9999",
  },
  {
    id: 3,
    name: "UP&DOWN 체크",
    nickname: "다운카드",
    linkedAccount: "987-654-3210",
  },
];

const costs = {
  total: {
    전체: 200000,
    식비: 120000,
    교통비: 30000,
    여가비: 40000,
    기타: 10000,
  },
  used: {
    전체: 160000,
    식비: 90000,
    교통비: 20000,
    여가비: 30000,
    기타: 20000,
  },
};

const historyItems = [
  { id: 1, date: "2025-08-22", title: "시로모케이블카", category: "교통비", type: "expense", amount: 20000, balanceAfter: 40000 },
  { id: 2, date: "2025-08-22", title: "개쩌는 식당", category: "식비", type: "expense", amount: 30000, balanceAfter: 60000 },
  { id: 3, date: "2025-08-21", title: "루이지마트", category: "기타", type: "expense", amount: 40000, balanceAfter: 90000 },
  { id: 4, date: "2025-08-21", title: "쏘카(렌트)", category: "교통비", type: "expense", amount: 70000, balanceAfter: 130000 },
  { id: 5, date: "2025-08-06", title: "한주원", category: "입금", type: "income", amount: 100000, balanceAfter: 200000 },
  { id: 6, date: "2025-08-06", title: "신다운", category: "입금", type: "income", amount: 100000, balanceAfter: 100000 },
];


export default function MyCardHistory() {
  const { id } = useParams();
  const [category, setCategory] = useState("전체");
  const [array, setArray] = useState("최신순");

  const card = cards.find((c) => String(c.id) === String(id));
  const total = costs.total[category] ?? 0;
  const used = costs.used[category] ?? 0;

  return (
    <Wrapper>
      <HistoryDetail>
        <BackRow>
          <BackBtn url={`/mypage/card/${id}`} text="내 카드" />
        </BackRow>

        {card && (
          <HeaderBox>
            <TitleRow>
              <Name>{card.name}</Name>
              <Divider>|</Divider>
              <Nickname>{card.nickname}</Nickname>
            </TitleRow>
            <Account>{card.linkedAccount}</Account>
          </HeaderBox>
        )}

        <FilterRow>
          <FilterDropdown
            label="카테고리"
            value={category}
            onChange={setCategory}
            options={["전체", "식비", "교통비", "여가비", "기타"]}
          />
          <FilterDropdown
            label="정렬"
            value={array}
            onChange={setArray}
            options={["최신순", "오래된 순"]}
          />
        </FilterRow>

        <ProgressBar
          category={category}
          used={used}
          total={total}
        />

        <HistoryList
          items={historyItems}
          showBalance
          showEdit
          onClickItem={(it) => console.log("click", it)}
        />
      </HistoryDetail>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.gray100};
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
`;

const CardBase = styled.div`
  background: ${colors.white};
  box-sizing: border-box;
  width: 1060px;
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;
`;

const HistoryDetail = styled(CardBase)`
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const BackRow = styled.div`
  align-self: flex-start;
`;

const HeaderBox = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const Name = styled.h2`
  ${fontSet.heading2};
  color: ${colors.black};
  margin: 0;
`;

const Divider = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Nickname = styled.span`
  ${fontSet.body2_m};
  color: ${colors.black};
`;

const Account = styled.div`
  ${fontSet.body2_m};
  color: ${colors.gray700};
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 4px;
`;

const FilterRow = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 10px;
  margin-top: 60px;
`;
