package com.goofinity.pgc_gateway;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.goofinity.pgc_gateway");

        noClasses()
            .that()
                .resideInAnyPackage("com.goofinity.pgc_gateway.service..")
            .or()
                .resideInAnyPackage("com.goofinity.pgc_gateway.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..com.goofinity.pgc_gateway.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}