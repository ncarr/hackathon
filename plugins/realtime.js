import gql from 'graphql-tag'
export default store => {
    store.subscribe(({ type, payload }, state) => {
        if (type === 'newEvent') {
          new ApolloClient({
              networkInterface: createNetworkInterface({
                uri: 'http://localhost:8000/api/graphql',
                opts: {
                  credentials: 'same-origin'
                }
              })
          })
          .mutate({
            mutation: gql`mutation($id: ID!, $name: String!, $description: String, $start: Date, $end: Date) {
                newEvent(id: id, name: name, description: description, start: start, end: end) {
                    id
                }
            }`,
            variables: { id: payload.id, name: payload.name, description: payload.description, start: payload.start, end: payload.end }
          })
          .then(whatever => console.log('done successfully'));
        }
    })
}
