'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (!attributes.additional_symptoms) {
                    await queryInterface.addColumn('submissions', 'additional_symptoms', {
                        type: Sequelize.BOOLEAN,
                        allowNull: true
                    });
                }
            })
        ];
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (attributes.additional_symptoms) {
                    await queryInterface.removeColumn('submissions', 'additional_symptoms');
                }
            })
        ];
    }
};
