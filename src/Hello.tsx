import React, { useEffect } from 'react';

type Props = {
  name: string;
  cluster: {id:number}
  count: number
};

const Hello: React.FC<Props> = ({ name, cluster, count }) => {
  console.log('Hello');

  useEffect(() => {
    console.log('Hello useEffect')
  }, [name])

  useEffect(() => {
    console.log({cluster})
  }, [cluster])

  return <div>Hello, {name}! Click {count}</div>;
};

export default Hello;

// export default React.memo(Hello, (prevProps, nextProps) => prevProps.name === nextProps.name)

// export default React.memo(Hello, (prevProps, nextProps) => prevProps.cluster.id === nextProps.cluster.id)
