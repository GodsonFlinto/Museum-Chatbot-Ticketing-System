import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../features/language/languageSlice";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.current);

  return (
    <select
      value={lang}
      onChange={(e) => dispatch(setLanguage(e.target.value))}
      style={{
        padding: 6,
        borderRadius: 8,
        fontSize: 12
      }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="ta">தமிழ்</option>
    </select>
  );
};

export default LanguageToggle;
