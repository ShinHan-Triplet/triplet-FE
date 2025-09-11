import LargeBtn from "../../components/button/LargeBtn";
import { useNavigate } from "react-router-dom";
import { loadTripDraft, clearTripDraft } from "./TripDraftSession";

export default function Trip() {
  const navigate = useNavigate();
  const goToNewTrip = () => {
    navigate("/trip/new/details");
  };

  const hasDetails = (draft) => {
    return !!(draft?.startMs && draft?.endMs);
  };

  const hasCost = (draft) => {
    const b = draft?.budgets;
    if (!b) return false;
    const top = !!b.stay || !!b.insurance;
    const days = Object.values(b.days ?? {}).some((d) => {
      if (!d) return false;
      if (d.noSchedule) return true;
      const a = d.amounts ?? {};
      return !!(a.food || a.transport || a.leisure || a.etc);
    });
    return top || days;
  };

  const goNext = () => {
    const draft = loadTripDraft();

    if (!draft || (!hasDetails(draft) && !hasCost(draft))) {
      navigate("/trip/new/details");
      return;
    }

    const ok = window.confirm(
      "이전에 작성한 내용이 있어요. 이어서 작성할까요?"
    );
    if (!ok) {
      clearTripDraft();
      navigate("/trip/new/details");
      return;
    }
    if (hasCost(draft)) {
      navigate("/trip/new/cost");
    } else navigate("/trip/new/details");
  };

  return (
    <>
      <div>trip</div>
      <LargeBtn label="다음" onClick={goNext} width={180}></LargeBtn>
    </>
  );
}
