import PropTypes from 'prop-types';

/** Displays a labeled administrator metric with an intentional color accent. */
export default function StatCard({ label, value, accent }) {
  return <article className={`rounded-2xl ${accent} p-5 text-white shadow-sm`}><p className="text-sm font-semibold text-white/85">{label}</p><p className="mt-3 text-3xl font-extrabold tabular-nums">{value}</p></article>;
}
StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.number.isRequired, accent: PropTypes.string.isRequired };
