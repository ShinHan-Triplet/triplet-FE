import styled from "styled-components";
import colors from "../../styles/colors";
import fontSet from "../../styles/fonts";
import editIcon from "../../assets/icon/modify.svg";
import Modal from "../modal/Modal";
import { useState } from "react";

// const CATEGORY_LABEL = {
//   1: "숙박비",
//   2: "보험비",
//   3: "식비",
//   4: "교통비",
//   5: "여가비",
//   6: "기타",
// };

const formatKRW = (n = 0) => `${Math.abs(n).toLocaleString()}원`;
const toMD = (dateStr) => {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
};

export default function HistoryList({
  items = [],
  onClickItem,
  onSave,
  showBalance = true,
  showEdit = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleItemClick = (it) => {
    setEditing(it); 
    setIsModalOpen(true);
    onClickItem?.(it);
  };
  const closeModal = () => { setIsModalOpen(false); setEditing(null); };

  return (
    <>
      <List role="list">
        {items.map((it) => (
          <HistoryItem
            key={it.id}
            item={it}
            onClick={() => handleItemClick(it)}
            showBalance={showBalance}
            showEdit={showEdit}
          />
        ))}
      </List>
      {isModalOpen && editing && (
        <Modal
          title="내역 수정하기"
          def1="알아보기 쉽게 내역을 수정하고"
          def2="원하는 기준으로 카테고리를 분류하세요."
          type={3}
          text={editing.title}
          categoryId={editing.categoryId ?? editing.category ?? 6}
          onClose={closeModal}
          func2={async ({ memo, categoryLabel }) => {
            await onSave?.(editing.id, { memo, categoryLabel, mcardId: editing.mcardId });
            closeModal();
          }}
        />
      )}
    </>
  );
}

function HistoryItem({ item, onClick, showBalance, showEdit }) {
  const isIncome = item.type === "income";
  const sign = isIncome ? "+" : "-";

  return (
    <Row role="listitem" onClick={onClick}>
      <DateCol>
        <DateText>{toMD(item.date)}</DateText>
      </DateCol>

      <MainCol>
        <TitleRow>
          <Title>{item.title}</Title>
          {showEdit && (
            <EditBtn
              type="button"
              aria-label="내역 수정"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              title="수정"
            >
              <img src={editIcon} alt="" />
            </EditBtn>
          )}
        </TitleRow>
        {item.category && <Tag>#{item.category}</Tag>}
      </MainCol>

      <AmountCol $income={isIncome}>
        <Amount $income={isIncome}>
          {sign}
          {formatKRW(item.amount)}
        </Amount>
        {showBalance && <Balance>{formatKRW(item.balanceAfter)}</Balance>}
      </AmountCol>
    </Row>
  );
}

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${colors.gray200};
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 90px 1fr 250px;
  align-items: center;
  gap: 12px;
  padding: 20px 40px;
  border-bottom: 1px solid ${colors.gray200};
  cursor: default;

  &:hover {
    background: ${colors.gray100};
  }
`;

const DateCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const DateText = styled.div`
  ${fontSet.body3_m};
  color: ${colors.gray700};
`;

const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Title = styled.div`
  ${fontSet.body3_b};
  color: ${colors.gray900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditBtn = styled.button`
  border: 0;
  background: transparent;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: ${colors.gray600};

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;

  ${Row}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: ${colors.gray100};
  }

  img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const Tag = styled.div`
  ${fontSet.detail};
  color: ${colors.gray700};
`;

const AmountCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const Amount = styled.div`
  ${fontSet.body3_b};
  color: ${({ $income }) => ($income ? colors.blue500 : colors.gray900)};
`;

const Balance = styled.div`
  ${fontSet.detail};
  color: ${colors.gray600};
`;
