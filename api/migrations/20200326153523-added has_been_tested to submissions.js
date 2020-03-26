'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (!attributes.has_been_tested) {
                    await queryInterface.addColumn('submissions', 'has_been_tested', {
                        type: Sequelize.BOOLEAN,
                        allowNull: true
                    });
                }
            })
        ]
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (attributes.has_been_tested) {
                    await queryInterface.removeColumn('submissions', 'has_been_tested');
                }
            })
        ]
    },
};
