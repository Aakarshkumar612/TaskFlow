/**
 * Coming Soon Page Component
 */

export function ComingSoonPage({ title }: { title: string }): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: '#8a8f98',
      fontSize: '18px',
    }}>
      🚧 {title} page coming soon
    </div>
  );
}
