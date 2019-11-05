FROM jboss/keycloak
COPY realm-export.json /opt/jboss/keycloak-demo/keycloak/realm-export.json
CMD ["-b", "0.0.0.0", "-bmanagement", "0.0.0.0", "-Dkeycloak.import=/opt/jboss/keycloak-demo/keycloak/realm-export.json"]
