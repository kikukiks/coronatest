'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (!attributes.close_contact) {
                    await queryInterface.addColumn('submissions', 'close_contact', {
                        type: Sequelize.TEXT,
                        allowNull: true
                    });
                }
            })
        ]
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (attributes.close_contact) {
                    await queryInterface.removeColumn('submissions', 'close_contact');
                }
            })
        ]
    },
};
