import React from 'react';

import { Provider } from 'react-redux';

import testData from '../../../../.storybook/test-data';
import configureStore from '../../../store/store';
import { AccountListItem } from '.';

const store = configureStore(testData);

const [chaosId, simpleId, hardwareId] = Object.keys(
  testData.metamask.internalAccounts.accounts,
);

const SIMPLE_ACCOUNT = {
  ...testData.metamask.internalAccounts.accounts[simpleId],
  balance: '0x152387ad22c3f0',
  keyring: {
    type: 'HD Key Tree',
  },
};

const HARDWARE_ACCOUNT = {
  ...testData.metamask.internalAccounts.accounts[hardwareId],
  balance: '0x152387ad22c3f0',
  keyring: {
    type: 'Ledger Hardware',
  },
};

const CHAOS_ACCOUNT = {
  ...testData.metamask.internalAccounts.accounts[chaosId],
  balance: '0x152387ad22c3f0',
  keyring: {
    type: 'HD Key Tree',
  },
};

const SNAP_IDENTITY = {
  ...testData.metamask.internalAccounts.accounts[
    '784225f4-d30b-4e77-a900-c8bbce735b88'
  ],
  metadata: {
    name: 'Snap Account 1',
    keyring: {
      type: 'Snap Keyring',
      id: 'Mock-snap',
      name: 'snap-name',
    },
  },
  balance: '0x152387ad22c3f0',
  label: 'Test Snap Name',
};

const CONTAINER_STYLES = {
  style: {
    width: '328px',
    border: '1px solid var(--color-border-muted)',
  },
};

const onClick = () => console.log('Clicked account!');

export default {
  title: 'Components/Multichain/AccountListItem',
  component: AccountListItem,
  argTypes: {
    account: {
      control: 'object',
    },
    selected: {
      control: 'boolean',
    },
    onClick: {
      action: 'onClick',
    },
    closeMenu: {
      action: 'closeMenu',
    },
    connectedAvatar: {
      control: 'text',
    },
    connectedAvatarName: {
      control: 'text',
    },
  },
  args: {
    account: SIMPLE_ACCOUNT,
    onClick,
  },
};

export const DefaultStory = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);

export const SelectedItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
SelectedItem.args = { selected: true };

export const HardwareItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
HardwareItem.args = { account: HARDWARE_ACCOUNT };
HardwareItem.decorators = [
  (story) => <Provider store={store}>{story()}</Provider>,
];

export const SelectedHardwareItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
SelectedHardwareItem.args = { account: HARDWARE_ACCOUNT, selected: true };
SelectedHardwareItem.decorators = [
  (story) => <Provider store={store}>{story()}</Provider>,
];

export const ChaosDataItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
ChaosDataItem.args = { account: CHAOS_ACCOUNT };

export const ConnectedSiteItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
ConnectedSiteItem.args = {
  connectedAvatar: 'https://uniswap.org/favicon.ico',
  connectedAvatarName: 'Uniswap',
};

export const ConnectedSiteChaosItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
ConnectedSiteChaosItem.args = {
  ACCOUNT: CHAOS_ACCOUNT,
  connectedAvatar: 'https://uniswap.org/favicon.ico',
  connectedAvatarName: 'Uniswap',
};

export const SnapItem = (args) => (
  <div {...CONTAINER_STYLES}>
    <AccountListItem {...args} />
  </div>
);
SnapItem.args = { identity: SNAP_IDENTITY };
SnapItem.decorators = [(story) => <Provider store={store}>{story()}</Provider>];

DefaultStory.storyName = 'Default';
