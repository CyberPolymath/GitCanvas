export default function SuccessMessage({ text }) {
	return text ? <div className="success-message">{text}</div> : null;
}
