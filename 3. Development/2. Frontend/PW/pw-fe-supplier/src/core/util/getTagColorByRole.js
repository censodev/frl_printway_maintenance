import configs from "../../config/project.config";

export default function getTagColorByRole(role) {
    return role === configs.roles[0]
        ? 'red'
        : role === configs.roles[1]
            ? 'volcano'
            : role === configs.roles[2]
                ? 'orange'
                : role === configs.roles[3]
                    ? 'blue'
                    : role === configs.roles[4]
                        ? 'geekblue'
                        : role === configs.roles[5]
                            ? 'purple'
                            : ''
}
