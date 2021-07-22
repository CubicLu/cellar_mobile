import gql from 'graphql-tag';

export const SEND_FEEDBACK = gql`
  mutation SendFeedback($file: Upload, $feedback: String!) {
    sendEmailFeedbackToSupport(file: $file, feedback: $feedback)
  }
`;
