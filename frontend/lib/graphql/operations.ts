import { gql } from '@apollo/client';

export const GET_LAST_PING = gql`
  query GetLastPing {
    ping
  }
`;

export const TRIGGER_PING = gql`
  mutation TriggerPing {
    ping
  }
`;

export const PING_SUBSCRIPTION = gql`
  subscription PingSubscription {
    ping
  }
`;
